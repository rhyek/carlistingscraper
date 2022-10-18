import * as aws from '@pulumi/aws';

export const lambdaRole = new aws.iam.Role('lambda-role', {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: 'lambda.amazonaws.com',
  }),
});

const lambdaRolePolicy = new aws.iam.Policy('lambda-role-policy', {
  policy: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',

          'sqs:SendMessage',
          'sqs:ReceiveMessage',
          'sqs:DeleteMessage',
          'sqs:GetQueueAttributes',

          'dynamodb:GetRecords',
          'dynamodb:GetShardIterator',
          'dynamodb:DescribeStream',
          'dynamodb:ListStreams',

          's3:PutObject',

          'ses:SendEmail',
        ],
        Resource: '*',
      },
    ],
  },
});

new aws.iam.RolePolicyAttachment(`lambda-role-policy-attachment`, {
  role: lambdaRole.name,
  policyArn: lambdaRolePolicy.arn,
});
