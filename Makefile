.PHONY: install dev build preview clean

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

clean:
	rm -rf node_modules dist

# Chrome with WebGPU flags for Linux
chrome-webgpu:
	google-chrome --enable-unsafe-webgpu --enable-features=Vulkan --use-vulkan http://localhost:5173

chrome-webgpu-gl:
	google-chrome --enable-unsafe-webgpu --use-angle=gl http://localhost:5173
