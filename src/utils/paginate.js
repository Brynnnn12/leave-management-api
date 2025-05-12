const paginate = async (model, query, options = {}) => {
  const { page = 1, limit = 10 } = query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const offset = (pageNumber - 1) * limitNumber;

  const { attributes, ...restOptions } = options;

  const { rows, count: total } = await model.findAndCountAll({
    attributes: attributes ?? { exclude: ["createdAt", "updatedAt"] },
    limit: limitNumber,
    offset,
    ...restOptions,
  });

  return {
    data: rows,
    pagination: {
      results: rows.length,
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

module.exports = paginate;
