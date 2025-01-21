// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        watch: false,
        environment: 'node',
        include: ['test/**/*.test.js'],
        // sequence: {
        //     concurrent: false,
        //     shuffle: false
        // },
    },
    resolve: {
        alias: {
        }
    },
    deps: {
        inline: false // Prevents inlining dependencies
    }
});