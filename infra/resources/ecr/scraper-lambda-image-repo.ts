import * as aws from '@pulumi/aws';

export const scraperLambdaImageRepo = new aws.ecr.Repository(
  'scraper-lambda-image-repo'
);
