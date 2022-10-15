module.exports = class Utils {
  static LIMIT = 1000;
  static async randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
};
