import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

const resourcesStack = new pulumi.StackReference(
  `rhyek/motores502scraper.resources/${pulumi.getStack()}`
);

const imageUri = process.env.IMAGE_URI!;
const arch = process.env.ARCH!;

const lambda = new aws.lambda.Function('scraper-lambda', {
  packageType: 'Image',
  imageUri,
  architectures: [arch],
  role: resourcesStack.getOutput('lambdaRoleArn'),
  timeout: 3 * 60,
  memorySize: 256,
});

export { imageUri };
