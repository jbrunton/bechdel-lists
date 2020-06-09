module.exports = {
  generateTag: generateTag
}

function generateTag(service, buildTarget, tag) {
  const imageName = buildTarget == 'dev' ? `bechdel-images-${service}` : `jbrunton/bechdel-images-${service}`;
  const imageTag = `${imageName}:${tag || 'latest'}`;
  return imageTag;
}

