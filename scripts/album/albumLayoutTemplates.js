// ======================================================
// TEMPLATES DE POSIÇÃO DO ÁLBUM
//
// -Cada template é uma lista de posições base
// -A seed vai pegar uma dessas posições
// -Depois vai aplicar uma variação aleatória pequena
//
// Importante:
// -x e y são porcentagens da página
// -rotate é em graus
// ======================================================

export const albumLayoutTemplates = {
  month: {
    1: [
      [
        { x: 50, y: 50, rotate: -4 },
      ],
    ],

    2: [
      [
        { x: 30, y: 45, rotate: -7 },
        { x: 70, y: 55, rotate: 6 },
      ],
      [
        { x: 35, y: 30, rotate: 5 },
        { x: 68, y: 68, rotate: -8 },
      ],
    ],

    3: [
      [
        { x: 25, y: 28, rotate: -8 },
        { x: 70, y: 35, rotate: 7 },
        { x: 48, y: 68, rotate: -3 },
      ],
      [
        { x: 30, y: 62, rotate: 6 },
        { x: 55, y: 25, rotate: -5 },
        { x: 78, y: 65, rotate: 9 },
      ],
    ],

    4: [
      [
        { x: 22, y: 24, rotate: -8 },
        { x: 72, y: 25, rotate: 7 },
        { x: 28, y: 66, rotate: 5 },
        { x: 75, y: 68, rotate: -10 },
      ],
      [
        { x: 30, y: 22, rotate: 6 },
        { x: 68, y: 38, rotate: -7 },
        { x: 24, y: 68, rotate: -4 },
        { x: 72, y: 70, rotate: 9 },
      ],
      [
        { x: 20, y: 35, rotate: -12 },
        { x: 55, y: 24, rotate: 4 },
        { x: 78, y: 58, rotate: 10 },
        { x: 35, y: 72, rotate: -5 },
      ],
    ],

    5: [
      [
        { x: 20, y: 24, rotate: -8 },
        { x: 52, y: 24, rotate: 4 },
        { x: 78, y: 32, rotate: 9 },
        { x: 30, y: 68, rotate: -5 },
        { x: 70, y: 70, rotate: 7 },
      ],
      [
        { x: 25, y: 28, rotate: 7 },
        { x: 70, y: 25, rotate: -8 },
        { x: 50, y: 50, rotate: 3 },
        { x: 24, y: 72, rotate: -10 },
        { x: 78, y: 70, rotate: 8 },
      ],
    ],

    6: [
      [
        { x: 20, y: 24, rotate: -8 },
        { x: 50, y: 22, rotate: 5 },
        { x: 78, y: 28, rotate: -5 },
        { x: 24, y: 64, rotate: 7 },
        { x: 52, y: 72, rotate: -6 },
        { x: 78, y: 66, rotate: 8 },
      ],
    ],

      7: [
      [
        { x: 15, y: 30, rotate: -8 },
        { x: 42, y: 27, rotate: 5 },
        { x: 70, y: 31, rotate: -5 },

        { x: 28, y: 58, rotate: 6 },
        { x: 60, y: 57, rotate: -7 },

        { x: 18, y: 82, rotate: -4 },
        { x: 76, y: 79, rotate: 7 },
      ],

      [
        { x: 20, y: 28, rotate: 6 },
        { x: 50, y: 26, rotate: -5 },
        { x: 78, y: 32, rotate: 7 },

        { x: 18, y: 60, rotate: -6 },
        { x: 55, y: 58, rotate: 5 },

        { x: 32, y: 82, rotate: 8 },
        { x: 76, y: 78, rotate: -7 },
      ],

      [
        { x: 17, y: 33, rotate: -7 },
        { x: 47, y: 28, rotate: 4 },
        { x: 77, y: 35, rotate: -6 },

        { x: 31, y: 61, rotate: 6 },
        { x: 66, y: 58, rotate: -5 },

        { x: 18, y: 82, rotate: 5 },
        { x: 55, y: 82, rotate: -8 },
      ],
    ],

    8: [
      [
        { x: 18, y: 22, rotate: -8 },
        { x: 42, y: 22, rotate: 5 },
        { x: 68, y: 24, rotate: -5 },
        { x: 82, y: 42, rotate: 8 },
        { x: 24, y: 52, rotate: 6 },
        { x: 52, y: 55, rotate: -7 },
        { x: 28, y: 78, rotate: -4 },
        { x: 72, y: 76, rotate: 7 },
      ],
    ],
  },

  bonus: {
    1: [
      [
        { x: 50, y: 50, rotate: 0 },
      ],
    ],

    2: [
      [
        { x: 35, y: 48, rotate: -5 },
        { x: 65, y: 52, rotate: 5 },
      ],
    ],

    3: [
      [
        { x: 28, y: 38, rotate: -6 },
        { x: 70, y: 38, rotate: 6 },
        { x: 50, y: 68, rotate: 0 },
      ],
    ],

    4: [
      [
        { x: 25, y: 30, rotate: -6 },
        { x: 72, y: 32, rotate: 6 },
        { x: 30, y: 68, rotate: 4 },
        { x: 70, y: 68, rotate: -4 },
      ],
    ],
  },
};