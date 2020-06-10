module.exports = {
  generateTag: generateTag
}

function generateTag(service, buildTarget, tag) {
  const imageName = buildTarget == 'dev' ? `bechdel-lists-${service}` : `jbrunton/bechdel-lists-${service}`;
  const imageTag = `${imageName}:${tag || 'latest'}`;
  return imageTag;
}

