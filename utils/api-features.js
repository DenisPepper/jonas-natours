const excludedKeys = ['page', 'sort', 'limit', 'fields'];
const queryPatterns = ['gte', 'gt', 'lte', 'lt'];
const defaultPageNumber = 1;
const defaultLimit = 50;

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    excludedKeys.forEach((key) => delete queryObj[key]);
    let queryString = JSON.stringify(queryObj);

    const patterns = queryPatterns.reduce(
      (acc, pattern, index) =>
        `${acc}${pattern}${index < queryPatterns.length - 1 ? '|' : ')\\b'}`,
      '\\b(',
    );
    queryString = queryString.replace(
      new RegExp(patterns, 'g'),
      (match) => `$${match}`,
    );

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // default sorting
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // default excluded fields
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || defaultPageNumber;
    const limit = Number(this.queryString.limit) || defaultLimit;
    this.query = this.query.skip((page - 1) * limit).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
