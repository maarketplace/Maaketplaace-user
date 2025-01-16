
export const shuffleArray = <T>(array: T[]) => {
    return array.reduce((shuffled: T[], _: T, index: number) => {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
      return shuffled;
    }, [...array]);
  };

  