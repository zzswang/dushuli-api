interface ListBooksRequest {
  query: {
    _limit?: number;
    _sort?: string;
    date_gt?: string;
    date_lt?: string;
  };
  context?: Object;
}

interface ListBooksResponse {
  body: Array<Books>;
  headers: {
    xTotalCount: string;
  };
}

interface CreateBookRequest {
  body: Books;
  context?: Object;
}

interface CreateBookResponse {
  body: Books;
}

interface ShowBookByIdOrSlugRequest {
  bookIdOrSlug: string;
  query: {
    identify: string;
  };
  context?: Object;
}

interface ShowBookByIdOrSlugResponse {
  body: Books;
}

interface DeleteBookByIdOrSlugRequest {
  bookIdOrSlug: string;
  query: {
    identify: string;
  };
  context?: Object;
}

interface UpdateBookByIdOrSlugRequest {
  bookIdOrSlug: string;
  query: {
    identify: string;
  };
  body: Books;
  context?: Object;
}

interface UpdateBookByIdOrSlugResponse {
  body: Books;
}

interface Books {
  date: string;
  holiday: string;
  solarTerm: string;
  slogan: string;
  book: string;
  author: string;
  summary: string;
  content: string;
  audio: string;
}
interface Err {
  code: string;
  message: string;
}
