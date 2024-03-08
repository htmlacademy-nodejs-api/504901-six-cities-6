export const getUserPipeline = (userId: string) => [
  {
    $lookup: {
      from: 'users',
      let: { userId: { $toObjectId: userId } },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
        { $project: { _id: 0, favorites: 1 } },
      ],
      as: 'users',
    },
  },
  {
    $addFields: {
      user: { $arrayElemAt: ['$users', 0] },
    },
  },
  {
    $unset: ['users'],
  },
];


export const defaultPipeline = [
  {
    $project: {
      _id: 0,
      id: { $toString: '$_id' },
      author: 1,
      city: 1,
      rating: 1,
      isFavorite: { $in: ['$_id', { $ifNull: ['$user.favorites', []] }] },
      commentCount: 1,
      image: 1,
      createdAt: 1,
      isPremium: 1,
      price: 1,
      title: 1,
      description: 1,
      location: 1,
      photos: 1,
      comforts: 1,
      typeOfHousing: 1,
      roomsCount: 1,
      guestsCount: 1,
    },
  },
];


export const commentsPipeline = [
  {
    $lookup: {
      from: 'comments',
      let: { offerId: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$$offerId', '$offerId'] } } },
        { $project: { _id: 0, rating: 1 } },
      ],
      as: 'comments',
    },
  },
];

export const authorPipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'users',
    },
  },
  {
    $addFields: {
      author: { $arrayElemAt: ['$users', 0] },
    },
  },
  {
    $unset: ['users'],
  },
];

export const getPipeline = (userId?: string) => {
  const userPipeline = userId ? getUserPipeline(userId) : [];

  return [
    ...authorPipeline,
    ...userPipeline,
    ...defaultPipeline,
  ];
};
