import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.green(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            cli.js --<command> [--arguments]
        Команды:
            --version:                   # выводит номер версии приложения
            --help:                      # печатает список доступных команд
            --import <path>:             # импортирует тестовые данные из файла формата TSV указанного в path
            --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных
                                         # n - количество тестовых данных,
                                         # path - имя файла для записи сгенерированных данных в формате TSV,
                                         # url - сервер предоставляющий данные для генерации
    `));
  }
}
