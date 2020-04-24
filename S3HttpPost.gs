/* constructs an S3HttpPost
 *
 * @constructor
 * @param {string} accessKeyId your AWS AccessKeyId
 * @param {string} secretAccessKey your AWS SecretAccessKey
 * @param {string} bucket your AWS S3 Bucket name
 * @param {string} region your AWS Service Region
 * @param {string} S3 access control lists (https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl)
 */
function S3HttpPost(accessKeyId, secretAccessKey, bucket, region, acl) {
  if (typeof accessKeyId !== 'string') throw new Error("Must provide accessKeyId");
  if (typeof secretAccessKey !== 'string') throw new Error("Must provide secretAcessKey");
  if (typeof bucket !== 'string') throw new Error("Must provide bucket name");
  if (typeof region !== 'string') throw new Error("Must provide region");
  this.opts = { accessKeyId, secretAccessKey, bucket, region, acl: acl || 'private' };
  this.datetime = this.getDatetime();
  this.credentials = this.opts.accessKeyId + "/" + this.datetime.date + "/" + this.opts.bucket + "/s3/aws4_request";
}
S3HttpPost.prototype.getDatetime = function () {
  const now = new Date();
  const date = now.getUTCFullYear() + ("0" + (now.getUTCMonth()+1) ).slice(-2) + ("0" + now.getUTCDate()).slice(-2);
  const time = ("0" + now.getUTCHours()).slice(-2) + ("0" + now.getUTCMinutes()).slice(-2) + ("0" + now.getUTCSeconds()).slice(-2);
  return {
    date: date,
    time: time,
    iso: date + 'T' + time + 'Z',
    expiration: (+now.toISOString().substr(0, 4) + 10) + now.toISOString().substr(4) // +10 years
  };
}
S3HttpPost.prototype.generatePolicy = function() {
  const policy = {
    'expiration': this.datetime.expiration,
    'conditions': [
      { 'bucket': this.opts.bucket },
      [ 'starts-with', '$key', '' ],
      { 'acl': this.opts.acl },
      [ 'starts-with', '$Content-Type', '' ],
      { 'x-amz-meta-uuid': '14365123651274' },
      { 'x-amz-server-side-encryption': 'AES256' },
      [ 'content-length-range', 0, 524288000 ], // 500MB
      { 'x-amz-credential': this.credentials },
      { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
      { 'x-amz-date': this.datetime.iso }
    ]
  };
  return policy;
};
S3HttpPost.prototype.generateStringToSign = function() {
  const policy = this.generatePolicy();
  return Utilities.base64Encode(JSON.stringify(policy), Utilities.Charset.UTF_8);
}
S3HttpPost.prototype.generateSignature = function(string_to_sign) {
  const date_key= CryptoJS.HmacSHA256(this.datetime.date, "AWS4" + this.opts.secretAccessKey, { asBytes: true})
  const date_region_key= CryptoJS.HmacSHA256(this.opts.region, date_key, { asBytes: true });
  const date_region_service_key=CryptoJS.HmacSHA256('s3', date_region_key, { asBytes: true });
  const signing_key= CryptoJS.HmacSHA256("aws4_request", date_region_service_key, { asBytes: true });
  const signature = CryptoJS.HmacSHA256(string_to_sign, signing_key, { asBytes: true });
  return signature.toString();
};
S3HttpPost.prototype.getFormPayload = function(file, string_to_sign, signature) {
  const formData = {
    'key': file.getName(),
    'acl': this.opts.acl,
    'content-type': file.getContentType(),
    'policy': string_to_sign,
    'x-amz-meta-uuid': '14365123651274',
    'x-amz-server-side-encryption': 'AES256',
    'x-amz-credential': this.credentials,
    'x-amz-algorithm': 'AWS4-HMAC-SHA256',
    'x-amz-date': this.datetime.iso,
    'x-amz-signature': signature,
    'file': file
  };
  return formData;
};

/* Uploading a File to Amazon S3 Using HTTP POST
 *
 * @param {Blob} file object as a blob.
 * @returns {HttpResponse}
 */
S3HttpPost.prototype.upload = function(file) {
  const string_to_sign = this.generateStringToSign();
  const signature = this.generateSignature(string_to_sign);
  const url = 'http://' + this.opts.bucket + '.s3.amazonaws.com/';
  const payload = this.getFormPayload(file, string_to_sign, signature);
  const options = {
    method : 'post',
    payload : payload
  };
  return UrlFetchApp.fetch(url, options);
};
