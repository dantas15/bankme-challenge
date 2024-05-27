export type ValidationMessage<T> = {
  [K in Partial<keyof T>]: string[];
};

export function groupValidationMessagesFromApi<T>(
  apiMessage: unknown
): ValidationMessage<T> | undefined {
  if (!Array.isArray(apiMessage)) {
    return;
  }

  const validationMessages: ValidationMessage<T> = {} as ValidationMessage<T>;

  for (const message of apiMessage) {
    const words = message.split(' ');
    const key = words[0] as keyof T;
    const errorMessage = words.slice(1).join(' ');

    if (validationMessages[key]) {
      validationMessages[key].push(errorMessage);
    } else {
      validationMessages[key] = [message];
    }
  }

  return validationMessages;
}
