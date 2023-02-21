import { useCreateHandler } from '@gear-js/react-hooks';
import { InitPayload, Hex } from 'types';
import { PROGRAM } from 'consts';
import metaTxt from 'assets/meta/meta.txt';
import { useMetadata } from './useMetadata';

function useSupplyChainMetadata() {
  return useMetadata(metaTxt);
}

function useCreateSupplyChain(onSuccess: (programId: Hex) => void) {

  const meta = useSupplyChainMetadata();
  const createProgram = useCreateHandler(PROGRAM.CODE_HASH, meta);

  return (payload: InitPayload) => createProgram(payload, { onSuccess });
}

export { useCreateSupplyChain };
