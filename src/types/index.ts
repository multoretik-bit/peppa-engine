export interface Character {
  name: string;
  role: string;
  description?: string;
}

export interface Story {
  title: string;
  content: string;
  characters: Character[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  steps: string[];
  outcome: string;
}
