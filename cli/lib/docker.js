module.exports = {
  generateTag: generateTag
}

function generateTag(service, buildTarget, tag) {
  const imageName = buildTarget == 'prod' ? `jbrunton/bechdel-lists-${service}` : `bechdel-lists-${service}`;
  const imageTag = `${imageName}:${tag || 'latest'}`;
  return imageTag;
}

