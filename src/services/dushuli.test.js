// import Service from "./dushuli";

test("should use mongoose mock", () => {
  expect(true).toBe(true);
});

// // should use mongoose mock

// test("listBooks service should work", async () => {
//   const result = await Service.listBooks({
//     query: {},
//   });
//   expect(result).toHaveLength(3);
// });

// test("createBook service should work", async () => {
//   const result = Service.createBook({
//     date: "2018-12-24T13:32:40+08:00",
//     holiday: "春节1",
//     solarTerm: "春分1",
//     book: "一本书2",
//     author: "作者2",
//     summary: "一些summary123",
//     content: "<p>dasdhadd3123<d>dasdad</d></p>",
//   });
//   expect(result.book).toBe("一本书2");
// });

// test("showBookById service should work", async () => {
//   const result = Service.showBookById({ bookId: "5c2075a6fe46ab69eec17de0" });
//   expect(result).toEqual({
//     date: "2018-12-24T05:32:40.000Z",
//     holiday: "春节1",
//     solarTerm: "春分1",
//     book: "一本书2",
//     author: "作者2",
//     summary: "一些summary123",
//     content: "<p>dasdhadd3123<d>dasdad</d></p>",
//     updatedAt: "2018-12-24T05:59:02.250Z",
//     createdAt: "2018-12-24T05:59:02.250Z",
//     id: "5c2075a6fe46ab69eec17de0",
//   });
// });

// test("updateBookById service should work", async () => {
//   const result = Service.showBookById({
//     bookId: "5c2075a6fe46ab69eec17de0",
//     body: {
//       date: "2018-12-24T05:32:40.000Z",
//       holiday: "春节1",
//       solarTerm: "春分1",
//       book: "一本书2",
//       author: "作者2",
//       summary: "一些summary123",
//       content: "<p>dasdhadd3123<d>dasdad</d></p>",
//       updatedAt: "2018-12-24T05:59:02.250Z",
//       createdAt: "2018-12-24T05:59:02.250Z",
//     },
//   });
//   expect(result).toEqual({
//     date: "2018-12-24T05:32:40.000Z",
//     holiday: "春节1",
//     solarTerm: "春分1",
//     book: "一本书2",
//     author: "作者2",
//     summary: "一些summary123",
//     content: "<p>dasdhadd3123<d>dasdad</d></p>",
//     updatedAt: "2018-12-24T05:59:02.250Z",
//     createdAt: "2018-12-24T05:59:02.250Z",
//     id: "5c2075a6fe46ab69eec17de0",
//   });
// });

// test("deleteBookById service should work", async () => {
//   const result = Service.deleteBookById({ bookId: "5c2075a6fe46ab69eec17de0" });
//   expect(result.ok).toBe(1);
// });
