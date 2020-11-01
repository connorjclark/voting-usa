declare global {
  namespace Voting {
    interface Results {
      states: State[];
      categories: Record<string, Category>;
    }

    interface State {
      name: string;
      shortCode: string;
      score: number;
      data: Record<string, CategoryResult>;
    }

    interface CategoryResult {
      value: string;
      score: number|null;
      notes?: string;
    }

    type Rubric = Record<string, number>;

    interface Category {
      name: string;
      weight: number;
      rubric: Rubric;
      sources: string;
    }
  }
}

export {};
