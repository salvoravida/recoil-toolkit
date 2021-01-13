import { push, uniqueId } from '../_core';
import { ERRORS_STACK_SIZE } from '../atoms';
import { ErrorAtom } from '../types';

export const pushError = ({ key, error, taskId }: Partial<ErrorAtom>) =>
   push<ErrorAtom>({ key, error, id: uniqueId(), taskId }, ERRORS_STACK_SIZE);
