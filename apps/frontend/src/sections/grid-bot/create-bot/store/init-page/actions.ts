import { createAction } from "@reduxjs/toolkit";

const INIT_PAGE = "initPage";
export const initPageAction = createAction(INIT_PAGE);

const MARK_PAGE_AS_READY = "markPageAsReady";
export const markPageAsReadyAction = createAction(MARK_PAGE_AS_READY);
