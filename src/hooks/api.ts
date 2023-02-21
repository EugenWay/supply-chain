import { useAccount, useSendMessage, useReadFullState } from '@gear-js/react-hooks';
import { useMemo } from 'react';
import { LOCAL_STORAGE } from 'consts';
import { Item, Items, Token, Hex } from 'types';
import stateMetaWasm from 'assets/wasm/state.wasm';
import metaTxt from 'assets/meta/meta.txt';
import nftMetaTxt from 'assets/meta/NFTmeta.txt';
import { useMetadata, useWasmMetadata } from './useMetadata';
import { useReadWasmState } from './useReadWasmState';

type ItemState = { ItemInfo: Item };
type ItemsState = { ExistingItems: Items };
type RolesState = { Roles: string[] };
type NFTState = { token: Token };


function useSupplyChainState<T>(functionName: string, payload?: any) {
  const { buffer } = useWasmMetadata(stateMetaWasm);
  return useReadWasmState<T>(localStorage[LOCAL_STORAGE.PROGRAM], buffer, functionName, payload);
}

// function useSupplyChainFullState<T>() {
//   const { metadata } = useMetadata(metaTxt);
//   return useReadFullState<T>(localStorage[LOCAL_STORAGE.PROGRAM], metadata);
// }

function useSupplyChainMetadata() {
  return useMetadata(metaTxt);
}

function useNFTnMetadata() {
  return useMetadata(nftMetaTxt);
}

function useItem(itemId: string) {
  const { state, isStateRead } = useSupplyChainState<ItemState>('item_info', itemId);
  return { item: state?.ItemInfo, isItemRead: isStateRead };
}

function useItems() {
  const { state, isStateRead } = useSupplyChainState<any>('existing_items');

  return { items: state, isEachItemRead: isStateRead };
}

function useRoles() {
  const { account } = useAccount();
  const address = account?.decodedAddress;

  const payload = useMemo(() => (address ? { Roles: address } : undefined), [address]);
  const { state, isStateRead } = useSupplyChainState<RolesState>(payload);

  return { roles: state?.Roles, isEachRoleRead: isStateRead };
}

// get NFT id
function useNftProgramId() {
  const { state } = useSupplyChainState<Hex>('non_fungible_token');
  return state;
}


function useNft() {
  const nftProgramId = useNftProgramId();
  const meta = useNFTnMetadata();

  const { state, isStateRead } = useReadFullState<NFTState>(nftProgramId, meta);

  return { nft: state?.token, isNftRead: isStateRead };
}

function useSupplyChainMessage() {
  const meta = useSupplyChainMetadata();
  return useSendMessage(localStorage[LOCAL_STORAGE.PROGRAM], meta);
}

export { useItem, useItems, useRoles, useNft, useSupplyChainMessage };
