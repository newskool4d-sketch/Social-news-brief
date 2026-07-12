export type StandardRef = {
  code: string;
  gloss: string;
};

export type ArticleBody = {
  h: string;
  p: string;
};

export type Article = {
  id: string;
  scope: "국내" | "해외";
  title: string;
  subhead?: string;
  lede: string;
  body?: ArticleBody[];
  think?: string;
  standards: StandardRef[];
  tags: string[];
  source: {
    name: string;
    url: string;
  };
};

export type Issue = {
  date: string; // YYYY-MM-DD
  articles: Article[];
};

export type CurriculumStandard = {
  code: string;
  text: string;
  explain?: string;
};

export type CurriculumSubject = {
  type: "공통과목" | "일반선택" | "진로선택" | "융합선택";
  units: Record<string, string>;
  standards: CurriculumStandard[];
};

export type CurriculumRef = {
  meta: Record<string, unknown>;
  subjects: Record<string, CurriculumSubject>;
};

export type FlatStandard = {
  code: string;
  subjectKey: string;
  subjectType: CurriculumSubject["type"];
  unitKey: string;
  unitName: string;
  text: string;
  explain?: string;
};

export type ArticleView = Article & {
  primaryStandard: FlatStandard | null;
};

export type Face = {
  subjectKey: string;
  subjectType: CurriculumSubject["type"];
  unitNames: string[];
  articles: ArticleView[];
};
