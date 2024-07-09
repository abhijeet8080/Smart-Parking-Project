class ApiFeatures {
  constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
  }
  
  search(keyword) {
      if (!keyword) {
          return this; // No keyword provided, return the original query
      }
      
      // Use a regex to perform a case-insensitive search on the 'name', 'street', 'city', 'state', 'country', and 'category' fields
      const searchQuery = {
          $or: [
              { name: { $regex: keyword, $options: "i" } },
              { street: { $regex: keyword, $options: "i" } },
              { city: { $regex: keyword, $options: "i" } },
              { state: { $regex: keyword, $options: "i" } },
              { country: { $regex: keyword, $options: "i" } },
              { category: { $regex: keyword, $options: "i" } }
          ]
      };
      
      // Apply the search query to the current query
      this.query = this.query.find(searchQuery);
      
      return this; // Return this for method chaining
  }
  
  filter() {
    const queryCopy = { ...this.queryStr };
    // Removing some fields for pagination
    const removeFields = ["page", "limit", "keyword"];
    
    removeFields.forEach((key) => delete queryCopy[key]);
    
    // Filter for price, rating, and category
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    
    this.query = this.query.find(JSON.parse(queryStr));
    
    if (this.queryStr.category) {
        this.query = this.query.where('category').equals(this.queryStr.category);
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
