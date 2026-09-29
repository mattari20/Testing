import { execFileSync } from 'node:child_process';

const suites = [
  'test:m48','test:m49','test:m50','test:m51',
  'test:m52','test:m53','test:m54','test:m55',
  'test:m56','test:m57','test:m58','test:m59'
];

const failures = [];
for (const suite of suites) {
  try {
    execFileSync('npm', ['run', suite], { stdio: 'inherit' });
  } catch {
    failures.push(suite);
  }
}

if (failures.length) {
  console.error('V2 validation failed:', failures.join(', '));
  process.exit(1);
}

console.log('V2 validation suites completed successfully.');
