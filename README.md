# Next Fiber Drei Course Shaders

This repository contains a collection of shader and 3D model-based experiments built using Next.js and React Fiber (react-three-fiber). The project demonstrates various visual effects, 3D rendering techniques, and shader programming using GLSL.

## Table of Contents

- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Components Overview](#components-overview)
- [Shaders](#shaders)
- [Assets](#assets)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started with the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/Dzenoo/next-fiber-drei-course-shaders.git
cd next-fiber-drei-course-shaders
npm install
```

## Project Structure

- **src/app/**: Contains the main application files including global styles, layout, and the main page.
- **src/components/**: This directory holds all the 3D components and shaders.
  - **animated-galaxy/**: Galaxy animation using custom shaders.
  - **coffe-smoke/**: Smoke effect around a coffee model.
  - **earth/**: A 3D Earth model with atmospheric effects.
  - **fireworks/**: Fireworks display using particles and shaders.
  - **gpgpu/**: General-purpose computing on graphics processing units (GPGPU) example.
  - **hologram/**: Hologram effect using shaders.
  - **lights-shading/**: Various lighting and shading techniques.
  - **particles-cursor/**: Particle effects that follow the cursor.
  - **particles-morphing/**: Morphing particles effect.
  - **patterns/**: Different procedural patterns using shaders.
  - **procedural-terrain/**: A procedural terrain generation component.
  - **raging/**: Raging effect shaders.
  - **sliced-model/**: A sliced 3D model with shader effects.
  - **wobbly/**: Wobbly effect using shaders.
- **public/**: Contains all the static assets like models, textures, and images.

## Usage

To run the project locally:

```bash
npm run dev
```

## Assets

The `public` folder contains the 3D models, textures, and images used throughout the project. These assets are loaded and rendered by the components to create the visual effects.

## Contributing

Contributions are welcome! If you have ideas for new effects or improvements to the existing ones, feel free to fork the repository and submit a pull request.
