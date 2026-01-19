// Code validation utilities
// Validates JavaScript/React Native code before rendering

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error';
}

interface ValidationWarning {
  line: number;
  column: number;
  message: string;
  severity: 'warning';
}

/**
 * Basic syntax validation using regex patterns
 * Catches common errors AI makes
 */
export function validateCode(code: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const lines = code.split('\n');

  // Check for basic structure
  if (!code.includes('export default')) {
    errors.push({
      line: 1,
      column: 1,
      message: 'Missing default export. Code must have "export default function App()"',
      severity: 'error',
    });
  }

  // Check for StyleSheet.create
  if (!code.includes('StyleSheet.create')) {
    warnings.push({
      line: 1,
      column: 1,
      message: 'Missing StyleSheet.create(). Styles should be defined using StyleSheet.',
      severity: 'warning',
    });
  }

  // Check bracket balance
  const bracketBalance = checkBracketBalance(code);
  if (bracketBalance.curly !== 0) {
    errors.push({
      line: lines.length,
      column: 1,
      message: `Unbalanced curly braces: ${bracketBalance.curly > 0 ? 'missing }' : 'extra }'}`,
      severity: 'error',
    });
  }
  if (bracketBalance.round !== 0) {
    errors.push({
      line: lines.length,
      column: 1,
      message: `Unbalanced parentheses: ${bracketBalance.round > 0 ? 'missing )' : 'extra )'}`,
      severity: 'error',
    });
  }
  if (bracketBalance.square !== 0) {
    errors.push({
      line: lines.length,
      column: 1,
      message: `Unbalanced square brackets: ${bracketBalance.square > 0 ? 'missing ]' : 'extra ]'}`,
      severity: 'error',
    });
  }

  // Check for common syntax errors in StyleSheet
  const styleSheetErrors = checkStyleSheetSyntax(code, lines);
  errors.push(...styleSheetErrors);

  // Check for unterminated strings
  const stringErrors = checkUnterminatedStrings(code, lines);
  errors.push(...stringErrors);

  // Check for trailing commas issues in objects
  const commaErrors = checkTrailingCommas(code, lines);
  errors.push(...commaErrors);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check bracket balance
 */
function checkBracketBalance(code: string): { curly: number; round: number; square: number } {
  let curly = 0;
  let round = 0;
  let square = 0;
  let inString = false;
  let stringChar = '';
  let escaped = false;

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const prevChar = i > 0 ? code[i - 1] : '';

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (!inString && (char === '"' || char === "'" || char === '`')) {
      inString = true;
      stringChar = char;
      continue;
    }

    if (inString && char === stringChar) {
      inString = false;
      stringChar = '';
      continue;
    }

    if (inString) continue;

    // Skip comments
    if (char === '/' && code[i + 1] === '/') {
      while (i < code.length && code[i] !== '\n') i++;
      continue;
    }
    if (char === '/' && code[i + 1] === '*') {
      i += 2;
      while (i < code.length - 1 && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i++;
      continue;
    }

    switch (char) {
      case '{': curly++; break;
      case '}': curly--; break;
      case '(': round++; break;
      case ')': round--; break;
      case '[': square++; break;
      case ']': square--; break;
    }
  }

  return { curly, round, square };
}

/**
 * Check StyleSheet syntax for missing commas
 */
function checkStyleSheetSyntax(code: string, lines: string[]): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Find StyleSheet.create block
  const styleSheetMatch = code.match(/StyleSheet\.create\s*\(\s*\{/);
  if (!styleSheetMatch) return errors;

  const startIndex = code.indexOf(styleSheetMatch[0]);
  const startLine = code.substring(0, startIndex).split('\n').length;

  // Check for missing commas between style properties
  // Pattern: property: value,\n  nextProperty (should have comma)
  // Pattern: },\n  nextStyle: { (should have comma after })
  
  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1] || '';
    
    // Check for missing comma after closing brace
    // Pattern: "  }," should be followed by another style or closing
    if (line.trim() === '}' && nextLine.trim().match(/^[a-zA-Z_][a-zA-Z0-9_]*\s*:\s*\{/)) {
      errors.push({
        line: i + 1,
        column: line.length,
        message: 'Missing comma after closing brace. Add "," after "}"',
        severity: 'error',
      });
    }

    // Check for missing comma after property value
    // Pattern: value followed by newline with another property
    const valueMatch = line.match(/:\s*['"][^'"]*['"]$|:\s*\d+$|:\s*'[^']*'$/);
    if (valueMatch && nextLine.trim().match(/^[a-zA-Z_][a-zA-Z0-9_]*\s*:/)) {
      if (!line.trimEnd().endsWith(',')) {
        errors.push({
          line: i + 1,
          column: line.length,
          message: 'Missing comma after property value',
          severity: 'error',
        });
      }
    }
  }

  return errors;
}

/**
 * Check for unterminated strings
 */
function checkUnterminatedStrings(code: string, lines: string[]): ValidationError[] {
  const errors: ValidationError[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let inString = false;
    let stringChar = '';
    let escaped = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      // Skip template literals (they can be multi-line)
      if (char === '`') continue;

      if (!inString && (char === '"' || char === "'")) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar) {
        inString = false;
        stringChar = '';
      }
    }

    // If still in string at end of line (and not a template literal)
    if (inString && stringChar !== '`') {
      errors.push({
        line: i + 1,
        column: line.lastIndexOf(stringChar) + 1,
        message: `Unterminated string. Missing closing ${stringChar}`,
        severity: 'error',
      });
    }
  }

  return errors;
}

/**
 * Check for trailing comma issues
 */
function checkTrailingCommas(code: string, lines: string[]): ValidationError[] {
  const errors: ValidationError[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const nextLine = (lines[i + 1] || '').trim();

    // Check for double commas
    if (line.includes(',,')) {
      errors.push({
        line: i + 1,
        column: lines[i].indexOf(',,') + 1,
        message: 'Double comma detected',
        severity: 'error',
      });
    }

    // Check for comma before closing bracket
    if (line.match(/,\s*[}\])]/)) {
      // This is actually valid in JS, so just skip
    }
  }

  return errors;
}

/**
 * Try to auto-fix common syntax errors
 */
export function tryAutoFix(code: string): { code: string; fixes: string[] } {
  const fixes: string[] = [];
  let fixedCode = code;

  // Fix missing commas in StyleSheet
  // Pattern: }\n  styleName: {
  const styleSheetFix = fixedCode.replace(
    /(\})\s*\n(\s*)([a-zA-Z_][a-zA-Z0-9_]*\s*:\s*\{)/g,
    (match, brace, whitespace, nextStyle) => {
      fixes.push('Added missing comma after closing brace in StyleSheet');
      return `},\n${whitespace}${nextStyle}`;
    }
  );
  if (styleSheetFix !== fixedCode) {
    fixedCode = styleSheetFix;
  }

  // Fix missing commas after string values in styles
  // Pattern: 'value'\n  nextProp:
  const stringValueFix = fixedCode.replace(
    /(['"])\s*\n(\s*)([a-zA-Z_][a-zA-Z0-9_]*\s*:)/g,
    (match, quote, whitespace, nextProp) => {
      fixes.push('Added missing comma after string value');
      return `${quote},\n${whitespace}${nextProp}`;
    }
  );
  if (stringValueFix !== fixedCode) {
    fixedCode = stringValueFix;
  }

  // Fix missing commas after number values in styles
  // Pattern: 123\n  nextProp:
  const numberValueFix = fixedCode.replace(
    /(\d)\s*\n(\s*)([a-zA-Z_][a-zA-Z0-9_]*\s*:)/g,
    (match, digit, whitespace, nextProp) => {
      fixes.push('Added missing comma after number value');
      return `${digit},\n${whitespace}${nextProp}`;
    }
  );
  if (numberValueFix !== fixedCode) {
    fixedCode = numberValueFix;
  }

  return { code: fixedCode, fixes };
}

/**
 * Extract clean code from AI response
 */
export function extractCode(response: string): string {
  let code = response;

  // Remove markdown code blocks
  if (code.includes('```')) {
    code = code
      .replace(/```(?:javascript|jsx|js|tsx|react|typescript)?\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
  }

  // Remove any leading/trailing explanations
  const importMatch = code.match(/import\s+/);
  if (importMatch && importMatch.index && importMatch.index > 0) {
    code = code.substring(importMatch.index);
  }

  // Find the end of StyleSheet.create and trim anything after
  const styleSheetEndMatch = code.match(/StyleSheet\.create\s*\(\s*\{[\s\S]*?\}\s*\)\s*;?\s*$/);
  if (!styleSheetEndMatch) {
    // If no proper ending, try to find last });
    const lastBraceIndex = code.lastIndexOf('});');
    if (lastBraceIndex > 0) {
      code = code.substring(0, lastBraceIndex + 3);
    }
  }

  return code.trim();
}
