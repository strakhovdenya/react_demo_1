module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // новая функциональность
        "fix", // исправление ошибок
        "docs", // изменения в документации
        "style", // форматирование, отступы и т.д.
        "refactor", // рефакторинг кода
        "test", // добавление тестов
        "chore", // обновление зависимостей и т.д.
      ],
    ],
    "type-case": [2, "always", "lower"],
    "type-empty": [2, "never"],
    "scope-empty": [2, "never"],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
  },
};
