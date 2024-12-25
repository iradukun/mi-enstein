#!/bin/bash

# Install additional dependencies
npm install \
  @radix-ui/react-slot \
  @vercel/ai \
  ai \
  bcrypt \
  class-variance-authority \
  clsx \
  jsonwebtoken \
  lucide-react \
  mammoth \
  mongoose \
  next-auth \
  openai-edge \
  pdf.js-extract \
  react-speech-recognition \
  recharts \
  tailwind-merge \
  tailwindcss-animate \
  zod

# Install dev dependencies
npm install -D @types/bcrypt @types/jsonwebtoken @types/react-speech-recognition

# Install shadcn/ui components
npx shadcn@latest init
npx shadcn@latest add button card input label select textarea toast avatar progress



echo "All packages have been installed and directories have been created."