export const CreateCommentMessages = {
  text: {
    invalidFormat: 'text is required',
    lengthField: 'min length is 5, max is 2024',
  },
  rating: {
    invalidFormat: 'rating must be an integer',
    minValue: 'Min length for rating path is 1',
    maxValue: 'Max length for rating path is 5',
  },
  offerId: {
    invalidFormat: 'offerId field must be a valid id',
  },
  userId: {
    invalidFormat: 'userId field must be a valid id',
  },
} as const;
