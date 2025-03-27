# Checklist Generator
A React-based web application for creating, managing, and sharing customizable checklists for various workflows and projects.
## Overview
Checklist Generator allows users to create, customize, and manage checklists for different purposes. The application provides an intuitive interface for adding, editing, and organizing checklist items using drag-and-drop functionality.
## Features
- Create new checklists from scratch or templates
- Drag-and-drop interface for organizing items
- Load existing checklists from disk
- Responsive design that works across devices
- Built with modern React and TypeScript

## Requirements
To develop and run this project, you need:
- Node.js (LTS version recommended)
- Yarn package manager
- Modern web browser

## Getting Started
### Installation
1. Clone the repository:
``` bash
   git clone https://github.com/your-username/checklist-generator.git
   cd checklist-generator
```
1. Install dependencies:
``` bash
   yarn install
```
### Development
To start the development server:
``` bash
yarn start
```
This will launch the application using Vite's development server at `http://localhost:5173` (or another port if 5173 is already in use).
### Building for Production
To create a production build:
``` bash
yarn build
```
The build artifacts will be stored in the `dist/` directory.
## Tech Stack
- **Frontend Framework**: React 19
- **Language**: TypeScript 5.7.2
- **Routing**: React Router 7.4.0
- **UI Components**: PrimeReact 10.9.3
- **CSS Framework**: TailwindCSS 4.0.0
- **Build Tool**: Vite 5.4.11
- **Drag and Drop**: React DnD 16.0.1

## Contributing
We welcome contributions from the community! Here's how you can contribute:
### Development Workflow
1. Fork the repository
2. Create a feature branch:
``` bash
   git checkout -b feature/your-feature-name
```
3. Make your changes
2. Write or update tests if necessary
3. Ensure code linting and formatting is correct
4. Commit your changes with clear, descriptive messages
5. Push to your fork and submit a pull request

### Code Style
- We follow TypeScript best practices
- All components should be properly typed
- Use functional components and React hooks
- Format your code using the project's formatting rules
- Write meaningful comments for complex logic

### Pull Request Process
1. Update the README.md if needed with details of changes
2. Your PR should include a clear description of the changes and motivation
3. The PR will be reviewed by maintainers
4. Address any requested changes from code reviews
5. Once approved, your PR will be merged

### Reporting Issues
When reporting issues, please include:
- A clear description of the problem
- Steps to reproduce
- Expected behavior
- Screenshots if applicable
- Version information (browser, OS, etc.)

## License

Copyright © 2025 Gerben Jongerius.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
