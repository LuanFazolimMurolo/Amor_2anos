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
    [
      { x: 47, y: 48, rotate: 5 },
    ],
    [
      { x: 53, y: 52, rotate: -7 },
    ],
    [
      { x: 50, y: 44, rotate: 3 },
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
    [
      { x: 28, y: 60, rotate: 8 },
      { x: 72, y: 34, rotate: -6 },
    ],
    [
      { x: 40, y: 42, rotate: -5 },
      { x: 63, y: 58, rotate: 7 },
    ],
    [
      { x: 26, y: 38, rotate: -10 },
      { x: 74, y: 62, rotate: 9 },
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
    [
      { x: 22, y: 42, rotate: -9 },
      { x: 50, y: 25, rotate: 4 },
      { x: 76, y: 60, rotate: -6 },
    ],
    [
      { x: 28, y: 30, rotate: 7 },
      { x: 72, y: 30, rotate: -8 },
      { x: 50, y: 66, rotate: 3 },
    ],
    [
      { x: 25, y: 66, rotate: -6 },
      { x: 50, y: 35, rotate: 8 },
      { x: 76, y: 68, rotate: -5 },
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
    [
      { x: 25, y: 30, rotate: 8 },
      { x: 68, y: 28, rotate: -6 },
      { x: 32, y: 68, rotate: -7 },
      { x: 72, y: 65, rotate: 5 },
    ],
    [
      { x: 18, y: 52, rotate: -8 },
      { x: 43, y: 28, rotate: 5 },
      { x: 70, y: 42, rotate: -5 },
      { x: 55, y: 72, rotate: 8 },
    ],
    [
      { x: 35, y: 27, rotate: -6 },
      { x: 73, y: 35, rotate: 8 },
      { x: 23, y: 63, rotate: 5 },
      { x: 62, y: 70, rotate: -7 },
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
    [
      { x: 22, y: 36, rotate: -9 },
      { x: 50, y: 24, rotate: 5 },
      { x: 78, y: 40, rotate: -6 },
      { x: 34, y: 70, rotate: 8 },
      { x: 68, y: 67, rotate: -7 },
    ],
    [
      { x: 28, y: 25, rotate: 6 },
      { x: 68, y: 28, rotate: -8 },
      { x: 18, y: 58, rotate: -5 },
      { x: 50, y: 72, rotate: 7 },
      { x: 82, y: 60, rotate: 5 },
    ],
    [
      { x: 18, y: 28, rotate: -7 },
      { x: 52, y: 30, rotate: 5 },
      { x: 82, y: 25, rotate: -5 },
      { x: 30, y: 64, rotate: 8 },
      { x: 72, y: 68, rotate: -8 },
    ],
    [
      { x: 30, y: 36, rotate: 9 },
      { x: 70, y: 34, rotate: -9 },
      { x: 50, y: 55, rotate: 2 },
      { x: 22, y: 73, rotate: -6 },
      { x: 78, y: 73, rotate: 7 },
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
    [
      { x: 22, y: 30, rotate: 7 },
      { x: 55, y: 25, rotate: -6 },
      { x: 80, y: 38, rotate: 8 },
      { x: 20, y: 68, rotate: -8 },
      { x: 50, y: 62, rotate: 5 },
      { x: 75, y: 72, rotate: -7 },
    ],
    [
      { x: 18, y: 38, rotate: -9 },
      { x: 44, y: 25, rotate: 6 },
      { x: 72, y: 30, rotate: -5 },
      { x: 28, y: 72, rotate: 8 },
      { x: 58, y: 63, rotate: -7 },
      { x: 82, y: 67, rotate: 6 },
    ],
    [
      { x: 25, y: 24, rotate: 5 },
      { x: 62, y: 26, rotate: -7 },
      { x: 82, y: 50, rotate: 8 },
      { x: 18, y: 55, rotate: -8 },
      { x: 38, y: 74, rotate: 6 },
      { x: 72, y: 72, rotate: -5 },
    ],
    [
      { x: 18, y: 26, rotate: -6 },
      { x: 48, y: 28, rotate: 8 },
      { x: 78, y: 24, rotate: -8 },
      { x: 22, y: 70, rotate: 5 },
      { x: 52, y: 64, rotate: -5 },
      { x: 80, y: 72, rotate: 7 },
    ],
    [
      { x: 30, y: 30, rotate: -8 },
      { x: 68, y: 28, rotate: 6 },
      { x: 18, y: 52, rotate: 8 },
      { x: 50, y: 55, rotate: -4 },
      { x: 82, y: 52, rotate: -8 },
      { x: 50, y: 76, rotate: 5 },
    ],
  ],

  7: [
    [
      { x: 15, y: 28, rotate: -8 },
      { x: 42, y: 27, rotate: 5 },
      { x: 70, y: 31, rotate: -5 },
      { x: 28, y: 54, rotate: 6 },
      { x: 60, y: 55, rotate: -7 },
      { x: 22, y: 73, rotate: -4 },
      { x: 76, y: 72, rotate: 7 },
    ],
    [
      { x: 20, y: 27, rotate: 6 },
      { x: 50, y: 26, rotate: -5 },
      { x: 78, y: 30, rotate: 7 },
      { x: 20, y: 55, rotate: -6 },
      { x: 58, y: 55, rotate: 5 },
      { x: 34, y: 73, rotate: 8 },
      { x: 76, y: 72, rotate: -7 },
    ],
    [
      { x: 17, y: 31, rotate: -7 },
      { x: 47, y: 27, rotate: 4 },
      { x: 77, y: 33, rotate: -6 },
      { x: 31, y: 56, rotate: 6 },
      { x: 66, y: 55, rotate: -5 },
      { x: 20, y: 73, rotate: 5 },
      { x: 57, y: 72, rotate: -8 },
    ],
    [
      { x: 18, y: 25, rotate: 8 },
      { x: 48, y: 29, rotate: -5 },
      { x: 78, y: 25, rotate: 6 },
      { x: 25, y: 56, rotate: -7 },
      { x: 55, y: 52, rotate: 5 },
      { x: 82, y: 60, rotate: -8 },
      { x: 42, y: 74, rotate: 7 },
    ],
    [
      { x: 23, y: 30, rotate: -6 },
      { x: 56, y: 25, rotate: 7 },
      { x: 82, y: 38, rotate: -5 },
      { x: 18, y: 58, rotate: 8 },
      { x: 48, y: 55, rotate: -6 },
      { x: 75, y: 72, rotate: 7 },
      { x: 30, y: 76, rotate: -8 },
    ],
    [
      { x: 18, y: 36, rotate: -8 },
      { x: 42, y: 25, rotate: 6 },
      { x: 70, y: 28, rotate: -7 },
      { x: 82, y: 52, rotate: 8 },
      { x: 55, y: 55, rotate: -5 },
      { x: 25, y: 72, rotate: 6 },
      { x: 65, y: 75, rotate: -8 },
    ],
    [
      { x: 30, y: 27, rotate: 7 },
      { x: 65, y: 25, rotate: -6 },
      { x: 82, y: 48, rotate: 6 },
      { x: 18, y: 48, rotate: -7 },
      { x: 42, y: 60, rotate: 5 },
      { x: 70, y: 72, rotate: -8 },
      { x: 28, y: 76, rotate: 8 },
    ],
    [
      { x: 16, y: 27, rotate: -7 },
      { x: 43, y: 33, rotate: 5 },
      { x: 72, y: 25, rotate: -5 },
      { x: 82, y: 55, rotate: 8 },
      { x: 55, y: 52, rotate: -6 },
      { x: 20, y: 72, rotate: 7 },
      { x: 60, y: 75, rotate: -7 },
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
      { x: 28, y: 76, rotate: -4 },
      { x: 72, y: 75, rotate: 7 },
    ],
    [
      { x: 18, y: 28, rotate: 7 },
      { x: 45, y: 24, rotate: -5 },
      { x: 72, y: 28, rotate: 6 },
      { x: 25, y: 52, rotate: -8 },
      { x: 55, y: 50, rotate: 5 },
      { x: 82, y: 55, rotate: -7 },
      { x: 35, y: 75, rotate: 8 },
      { x: 70, y: 73, rotate: -6 },
    ],
    [
      { x: 20, y: 24, rotate: -6 },
      { x: 50, y: 24, rotate: 7 },
      { x: 80, y: 26, rotate: -8 },
      { x: 18, y: 55, rotate: 8 },
      { x: 42, y: 50, rotate: -5 },
      { x: 68, y: 55, rotate: 6 },
      { x: 30, y: 75, rotate: -7 },
      { x: 78, y: 74, rotate: 8 },
    ],
    [
      { x: 15, y: 34, rotate: -7 },
      { x: 38, y: 24, rotate: 5 },
      { x: 65, y: 25, rotate: -6 },
      { x: 85, y: 38, rotate: 7 },
      { x: 25, y: 60, rotate: 8 },
      { x: 52, y: 56, rotate: -7 },
      { x: 76, y: 62, rotate: 5 },
      { x: 48, y: 76, rotate: -5 },
    ],
    [
      { x: 22, y: 25, rotate: 7 },
      { x: 50, y: 22, rotate: -5 },
      { x: 78, y: 28, rotate: 6 },
      { x: 18, y: 54, rotate: -8 },
      { x: 45, y: 58, rotate: 5 },
      { x: 72, y: 52, rotate: -6 },
      { x: 30, y: 75, rotate: 8 },
      { x: 82, y: 73, rotate: -7 },
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
   legendary: {
    7: [
      // ======================================================
      // TEMPLO LENDÁRIO
      // ======================================================
      [
        { x: 50, y: 49, rotate: 0 },

        { x: 27, y: 27, rotate: -8 },
        { x: 50, y: 22, rotate: 3 },
        { x: 73, y: 27, rotate: 8 },

        { x: 27, y: 72, rotate: 7 },
        { x: 50, y: 78, rotate: -3 },
        { x: 73, y: 72, rotate: -7 },
      ],

      // ======================================================
      // COROA LENDÁRIA
      // ======================================================
      [
        { x: 50, y: 52, rotate: 0 },

        { x: 22, y: 36, rotate: -9 },
        { x: 38, y: 24, rotate: 5 },
        { x: 62, y: 24, rotate: -5 },
        { x: 78, y: 36, rotate: 9 },

        { x: 31, y: 74, rotate: 7 },
        { x: 69, y: 74, rotate: -7 },
      ],

      // ======================================================
      // CÍRCULO RARO
      // ======================================================
      [
        { x: 50, y: 50, rotate: 0 },

        { x: 50, y: 21, rotate: 2 },
        { x: 76, y: 35, rotate: 8 },
        { x: 76, y: 66, rotate: -8 },
        { x: 50, y: 80, rotate: -2 },
        { x: 24, y: 66, rotate: 8 },
        { x: 24, y: 35, rotate: -8 },
      ],

      // ======================================================
      // VITRINE LENDÁRIA
      // ======================================================
      [
        { x: 50, y: 47, rotate: 0 },

        { x: 24, y: 26, rotate: -7 },
        { x: 76, y: 26, rotate: 7 },

        { x: 20, y: 56, rotate: -5 },
        { x: 80, y: 56, rotate: 5 },

        { x: 33, y: 78, rotate: 6 },
        { x: 67, y: 78, rotate: -6 },
      ],
    ],
  },
};