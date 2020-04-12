const bucket = 'your s3 bucket name';
const accessKeyId = "AKIAIOSFODNN7EXAMPLE";
const secretAccessKey = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
const region = 'us-east-1';
const acl = 'private';

function uploadNewFile() {
  const s3 = new S3HttpPost(accessKeyId, secretAccessKey, bucket, region, acl);
  const resumeBlob = Utilities.newBlob('Hire me!', 'text/plain', 'resume.txt');
  s3.upload(resumeBlob);
}
function uploadImageUrl() {
  const s3 = new S3HttpPost(accessKeyId, secretAccessKey, bucket, region, acl);
  const body = UrlFetchApp.fetch('https://cdn.pixabay.com/photo/2016/06/14/00/14/cat-1455468_1280.jpg').getBlob();
  body.setName('soft_kitty.jpg');
  s3.upload(body);
}
