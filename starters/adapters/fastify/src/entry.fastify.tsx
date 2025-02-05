/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the fastify server when building for production.
 *
 * Learn more about Node.js server integrations here:
 * - https://qwik.builder.io/integrations/deployments/node/
 *
 */
import { type PlatformNode } from '@builder.io/qwik-city/middleware/node';
import Fastify from 'fastify';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import FastifyQwik from './plugins/fastify-qwik';

declare global {
  interface QwikCityPlatform extends PlatformNode {}
}

// Directories where the static assets are located
const distDir = join(fileURLToPath(import.meta.url), '..', '..', 'dist');
const buildDir = join(distDir, 'build');

// Allow for dynamic port
const PORT = parseInt(process.env.PORT ?? '3000');

const start = async () => {
  // Create the fastify server
  // https://www.fastify.io/docs/latest/Guides/Getting-Started/
  const fastify = Fastify({
    logger: true,
  });

  // Enable compression
  // https://github.com/fastify/fastify-compress
  // IMPORTANT NOTE: THIS MUST BE REGISTERED BEFORE THE fastify-qwik PLUGIN
  // await fastify.register(import('@fastify/compress'))

  // Handle Qwik City using a plugin
  await fastify.register(FastifyQwik, { distDir, buildDir });

  // Start the fastify server
  await fastify.listen({ port: PORT });
};

start();
