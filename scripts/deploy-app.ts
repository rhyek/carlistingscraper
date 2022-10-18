#!/usr/bin/env ts-node
import path from 'path';
import parseArgs from 'minimist';
import execa, { command } from 'execa';

process.chdir(path.resolve(__dirname, '..'));

const {
  _: [appName],
} = parseArgs(process.argv.slice(2));

(async () => {
  await command(`pnpm build ${appName}`, {
    cwd: './projects',
    stdio: 'inherit',
  });
  const tag = new Date().getTime().toString();
  await command(
    `aws ecr get-login-password | docker login -u AWS --password-stdin "https://$(aws sts get-caller-identity --query 'Account' --output text).dkr.ecr.${process.env.AWS_DEFAULT_REGION}.amazonaws.com"`,
    {
      stdio: 'inherit',
      shell: true,
    }
  );
  const { stdout: repoUrl } = await command(
    `pulumi stack --stack dev output repoUrls | jq -r '."${appName}"'`,
    {
      cwd: './infra/resources',
      shell: true,
    }
  );
  const imageUri = `${repoUrl}:${tag}`;
  await execa(
    'docker',
    [
      'buildx',
      'build',
      '--platform',
      process.env.CI ? 'linux/amd64' : 'linux/arm64',
      '-t',
      imageUri,
      '-f',
      `infra/deploy/${appName}/Dockerfile`,
      '--build-arg',
      `APP_NAME=${appName}`,
      ...(process.env.CI
        ? [
            '--cache-from',
            `type=gha,scope=${appName},url=${process.env.ACTIONS_CACHE_URL},token=${process.env.ACTIONS_RUNTIME_TOKEN}`,
            '--cache-to',
            `type=gha,scope=${appName},mode=max,url=${process.env.ACTIONS_CACHE_URL},token=${process.env.ACTIONS_RUNTIME_TOKEN}`,
          ]
        : []),
      '--push',
      '.',
    ],
    {
      stdio: 'inherit',
    }
  );
  await command('pulumi up --stack dev --yes', {
    cwd: `./infra/deploy/${appName}`,
    stdio: 'inherit',
    env: {
      IMAGE_URI: imageUri,
      ARCH: process.env.CI ? 'x86_64' : 'arm64',
    },
  });
})();
