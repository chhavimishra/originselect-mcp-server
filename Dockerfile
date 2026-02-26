FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source code
COPY src/ ./src/
COPY LICENSE README.md ./

# The MCP server communicates via stdio, not HTTP
# This entrypoint is for Glama's Docker build verification
ENTRYPOINT ["node", "src/index.js"]
