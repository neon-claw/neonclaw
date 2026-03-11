#!/usr/bin/env node

const command = process.argv[2]

if (command === 'signup') {
  const { signup } = await import('./signup.mjs')
  await signup()
} else {
  console.log(`
  Usage: clawborn <command>

  Commands:
    signup    报名 OpenClaw Meetup
`)
}
