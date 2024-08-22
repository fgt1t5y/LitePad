import { defineStore } from "pinia";
import { ref } from "vue";
import type { PageTabsItem } from "@/types";

export const usePageTabs = defineStore("pageTabs", () => {
  const _tabsID = new Set();
  const tabs = ref<PageTabsItem[]>([]);

  // 标签页是否存在
  const has = (tab_key: number) => {
    return _tabsID.has(tab_key);
  };

  // 追加标签页到列表末尾
  const push = (tab: PageTabsItem) => {
    if (has(tab.id)) return;

    _tabsID.add(tab.id);
    tabs.value!.push(tab);
  };

  // 删除标签页
  const close = (tab_id: number) => {
    console.log(tab_id);
    const tabIndex = tabs.value.findIndex((tab) => tab.id === tab_id);

    if (tabIndex === -1) return;

    _tabsID.delete(tab_id);
    tabs.value.splice(tabIndex, 1);
  };

  return { tabs, push, close };
});
