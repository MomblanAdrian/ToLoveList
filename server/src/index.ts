import app from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { prisma } from './config/database.js';

const QUESTIONS_BY_CATEGORY: Record<string, string[]> = {
  food: [
    'How much do you enjoy trying new cuisines?',
    'How important is restaurant ambiance to you?',
    'Do you prefer spicy food?',
    'How much do you enjoy street food?',
    'Do you like fine dining experiences?',
    'How important is organic/farm-to-table food?',
    'Do you enjoy cooking at home?',
    'How much do you like brunch?',
    'Do you prefer casual dining over formal?',
    'How important is dessert to you?',
    'Do you enjoy food from food trucks?',
    'How much do you like ethnic cuisine?',
    'Do you prefer vegetarian/vegan options?',
    'How important is presentation of food?',
    'Do you enjoy trying new restaurants regularly?',
    'How much do you like seafood?',
    'Do you prefer local cuisine when traveling?',
    'How important is price when choosing restaurants?',
    'Do you enjoy wine or cocktail pairings?',
    'How much do you like breakfast foods?',
    'Do you enjoy buffet-style dining?',
    'How important is restaurant location/proximity?',
  ],
  leisure: [
    'How much do you enjoy outdoor activities?',
    'Do you prefer cultural experiences?',
    'How much do you like museums?',
    'Do you enjoy sports and physical activities?',
    'How important is relaxation in your free time?',
    'Do you like DIY and hands-on workshops?',
    'How much do you enjoy live music?',
    'Do you prefer nature over city activities?',
    'How much do you like social gatherings?',
    'Do you enjoy solo activities?',
    'How important is trying new experiences?',
    'Do you like board games and puzzles?',
    'How much do you enjoy shopping?',
    'Do you prefer structured or spontaneous plans?',
    'How much do you like festivals and events?',
    'Do you enjoy art galleries?',
    'How important is budget for activities?',
    'Do you like volunteering activities?',
    'How much do you enjoy dancing?',
    'Do you like photography walks?',
    'How much do you enjoy spa and wellness?',
    'Do you like escape rooms and challenges?',
  ],
  travel: [
    'How much do you enjoy traveling?',
    'Do you prefer beach destinations?',
    'How much do you like mountain getaways?',
    'Do you prefer city breaks?',
    'How important is adventure in travel?',
    'Do you like luxury travel?',
    'How much do you enjoy road trips?',
    'Do you prefer budget travel?',
    'How important is local culture when traveling?',
    'Do you like all-inclusive resorts?',
    'How much do you enjoy solo travel?',
    'Do you prefer guided tours?',
    'How important is good food when traveling?',
    'Do you like off-the-beaten-path destinations?',
    'How much do you enjoy weekend trips?',
    'Do you prefer long vacations over short getaways?',
    'How important is travel photography?',
    'Do you like backpacking?',
    'How much do you enjoy cruise travel?',
    'Do you prefer warm or cold destinations?',
    'How important is sustainability in travel?',
    'Do you like staycations?',
  ],
  'tv-shows': [
    'How much do you enjoy watching TV shows?',
    'Do you prefer series or movies?',
    'How much do you like documentaries?',
    'Do you enjoy reality TV?',
    'How important is a good storyline?',
    'Do you like animated shows and anime?',
    'How much do you enjoy comedy series?',
    'Do you prefer drama and thrillers?',
    'How important is character development?',
    'Do you like binge-watching?',
    'How much do you enjoy sci-fi and fantasy?',
    'Do you prefer short series or long-running shows?',
    'How important is production quality?',
    'Do you like foreign language content?',
    'How much do you enjoy true crime?',
    'Do you prefer romantic shows?',
    'How important are reviews and ratings?',
    'Do you like classic TV shows?',
    'How much do you enjoy talk shows?',
    'Do you prefer streaming platforms?',
    'How important is diversity in casting?',
    'Do you enjoy miniseries?',
  ],
  'video-games': [
    'How much do you enjoy playing video games?',
    'Do you prefer single-player games?',
    'How much do you like multiplayer games?',
    'Do you enjoy competitive gaming?',
    'How important is story in games?',
    'Do you like RPGs and character building?',
    'How much do you enjoy puzzle games?',
    'Do you prefer action games?',
    'How important is graphics quality?',
    'Do you like indie games?',
    'How much do you enjoy strategy games?',
    'Do you prefer casual mobile games?',
    'How important is multiplayer co-op?',
    'Do you like open-world games?',
    'How much do you enjoy simulation games?',
    'Do you prefer console, PC, or mobile?',
    'How important is replayability?',
    'Do you like horror games?',
    'How much do you enjoy sports games?',
    'Do you prefer retro games?',
    'How important is game length?',
    'Do you enjoy sandbox/creative games?',
  ],
  books: [
    'How much do you enjoy reading books?',
    'Do you prefer fiction or non-fiction?',
    'How much do you like fantasy novels?',
    'Do you enjoy science fiction?',
    'How important is character development?',
    'Do you like romance novels?',
    'How much do you enjoy thrillers?',
    'Do you prefer self-improvement books?',
    'How important is the writing style?',
    'Do you like classic literature?',
    'How much do you enjoy biographies?',
    'Do you prefer series or standalone books?',
    'How important is book length?',
    'Do you like poetry?',
    'How much do you enjoy historical fiction?',
    'Do you prefer physical or digital books?',
    'How important are book reviews?',
    'Do you like short stories?',
    'How much do you enjoy audiobooks?',
    'Do you prefer diverse authors?',
    'How important is a satisfying ending?',
    'Do you like book clubs and discussions?',
  ],
};

async function seedDatabase() {
  const slugs = ['food', 'leisure', 'travel', 'tv-shows', 'video-games', 'books'];
  const names = ['Food', 'Plans & Leisure', 'Travel & Getaways', 'TV Shows & Streaming', 'Video Games', 'Books'];
  const descriptions = [
    'Restaurants, cafes, and culinary experiences',
    'Activities, events, and entertainment',
    'Destinations and trip ideas',
    'Shows, movies, and documentaries',
    'Games for every platform and style',
    'Reading recommendations across genres',
  ];
  const icons = ['utensils-crossed', 'sparkles', 'globe', 'tv', 'gamepad-2', 'book-open'];
  const colors = ['#FF6B35', '#7C3AED', '#2563EB', '#EC4899', '#10B981', '#F59E0B'];

  for (let idx = 0; idx < slugs.length; idx++) {
    const slug = slugs[idx]!;

    let category = await prisma.category.findUnique({ where: { slug } });
    if (!category) {
      category = await prisma.category.create({
        data: {
          id: `cat-${slug}`,
          name: names[idx]!,
          slug,
          description: descriptions[idx]!,
          icon: icons[idx]!,
          color: colors[idx]!,
        },
      });
      logger.info(`Created category: ${names[idx]}`);
    }

    const existingQuestions = await prisma.question.count({ where: { categoryId: category.id } });
    if (existingQuestions === 0) {
      const questions = QUESTIONS_BY_CATEGORY[slug] || [];
      for (let i = 0; i < questions.length; i++) {
        await prisma.question.create({
          data: {
            categoryId: category.id,
            text: questions[i]!,
            order: i + 1,
          },
        });
      }
      logger.info(`Seeded ${questions.length} questions for ${names[idx]}`);
    } else {
      logger.info(`Category ${names[idx]} already has ${existingQuestions} questions`);
    }
  }
}

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    await seedDatabase();

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

bootstrap();
