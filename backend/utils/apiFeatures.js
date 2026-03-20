class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    const removeFields = ["keyword", "page", "limit", "sort"];
    removeFields.forEach((key) => delete queryCopy[key]);

    if (queryCopy.category) {
      this.query = this.query.find({
        category: { $regex: queryCopy.category, $options: "i" },
      });

      delete queryCopy.category;
    }

    let queryStr = JSON.stringify(queryCopy);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    const parsed = JSON.parse(queryStr);

    this.query = this.query.find(parsed);

    return this;
  }

  sort() {
    let sortOption = {};

    if (this.queryStr.sort === "price_asc") {
      sortOption.price = 1;
    } else if (this.queryStr.sort === "price_desc") {
      sortOption.price = -1;
    } else if (this.queryStr.sort === "rating_desc") {
      sortOption.ratings = -1;
    } else if (this.queryStr.sort === "newest") {
      sortOption.createdAt = -1;
    } else {
      sortOption.createdAt = -1;
    }

    this.query = this.query.sort(sortOption);
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
