import buildUrl from 'build-url';

export default ({ reLaunch, ...options }) => {
  const url = buildUrl(options);

  if (!reLaunch) return url;

  return buildUrl({
    path: '/pages/meetings/main',
    queryParams: {
      id: 3,
      nextPage: url,
      nextType: 'immediate',
    },
  });
};
