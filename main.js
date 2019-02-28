var bucket = 'your s3 bucket name';
var accessKeyId = "AKIAIOSFODNN7EXAMPLE";
var secretAccessKey = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
var region = 'us-east-1';

function upload_new_file() {
  var s3 = new S3HttpPost(accessKeyId, secretAccessKey, bucket, region);
  var resumeBlob = Utilities.newBlob('Hire me!', 'text/plain', 'resume.txt');
  var key = resumeBlob.getName();
  s3.upload(key, resumeBlob);
}
function upload_image_url() {
  var s3 = new S3HttpPost(accessKeyId, secretAccessKey, bucket, region);
  var body = UrlFetchApp.fetch('https://cdn.pixabay.com/photo/2016/06/14/00/14/cat-1455468_1280.jpg').getBlob();
  body.setName('soft_kitty.jpg');
  s3.upload(key, body);
}
