FROM public.ecr.aws/lambda/nodejs:16
ARG APP_NAME
RUN npm i -g pnpm
WORKDIR ${LAMBDA_TASK_ROOT}
COPY projects/package.json projects/pnpm-lock.yaml ./
RUN pnpm install --production
COPY projects/dist/apps/${APP_NAME} .
CMD [ "main.handler" ]
