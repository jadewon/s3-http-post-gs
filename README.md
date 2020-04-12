# s3-http-post-gs
Uploading a File to Amazon S3 Using HTTP POST from Google Script.\
Implemented to request authentication with the AWS Signature Version 4 algorithm (AWS4-HMAC-SHA256).

This code implemented Browser-Based Uploads Using POST\
[Authenticating Requests in Browser-Based Uploads Using POST (AWS Signature Version 4)](https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-UsingHTTPPOST.html)

## Quick Start

1. Create your [AWS access key](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html)

```
aws iam create-access-key --user-name USERNAME
```

```
{
    "AccessKey": {
        "UserName": "USERNAME",
        "Status": "Active",
        "CreateDate": "2030-04-12T10:39:43.213Z",
        "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYzEXAMPLEKEY",
        "AccessKeyId": "AKIAIOSFODNN7EXAMPLE"
    }
}
```

2. Replace variable values in [main.gs](https://github.com/jadewon/s3-http-post-gs/blob/master/main.gs#L1-L4) to your Provider Credentials

```javascript
# https://github.com/jadewon/s3-http-post-gs/blob/master/main.gs
const bucket = 'your s3 bucket name';
const accessKeyId = "AKIAIOSFODNN7EXAMPLE";
const secretAccessKey = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
const region = 'us-east-1';
const acl = 'private';
```

3. Install clasp via npm
```shell
npm install -g @google/clasp
```

4. Creates a new google script project.
```shell
$ clasp login
$ clasp create --type standalone --title "S3 http post"
$ clasp push
$ clasp open
```
