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
    const removeFields = ["keyword", "page", "limit", "sort", "currentPage"];
    removeFields.forEach((key) => delete queryCopy[key]);
    if (queryCopy.category && queryCopy.category !== "") {
      this.query = this.query.find({
        category: { $regex: queryCopy.category, $options: "i" },
      });
    }
    return this;
  }


  sort() {
    if (this.queryStr.sort) {
      let sortBy = {};

      switch (this.queryStr.sort) {
        case "price_asc":
          sortBy.originalPrice = 1;
          break;
        case "price_desc":
          sortBy.originalPrice = -1;
          break;
        case "rating":
          sortBy.ratings = -1;
          break;
        case "newest":
          sortBy.createdAt = -1;
          break;
        default:
          break;
      }

      this.query = this.query.sort(sortBy);
    }
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
