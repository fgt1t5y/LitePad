import { defineStore } from "pinia";
import { ref } from "vue";
import type { PageTabsItem } from "@/types";
import router from "@/router";

const defaultTab: PageTabsItem = {
  id: -1,
  label: "首页",
  path: "/",
};

export const usePageTabs = defineStore("pageTabs", () => {
  const _tabsID = new Set<number>();
  const tabs = ref<PageTabsItem[]>([]);
  const current = ref<number>();

  const _close = (tab: PageTabsItem) => {
    const tabIndex = tabs.value.findIndex((item) => item.id === tab.id);
    _tabsID.delete(tab.id);
    tabs.value.splice(tabIndex, 1);
  };

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

  // 切换到另一个标签页，并更新状态
  const to = (tab: PageTabsItem) => {
    current.value = tab.id;
    router.replace(tab.path);
  };

  // 删除标签页
  const close = (tab: PageTabsItem) => {
    // 若关闭的标签页不是当前标签页，直接关闭即可
    if (tab.id !== current.value) {
      _close(tab);
      return;
    }

    /**
     * 若不是当前标签页，得查找当前标签页的id
     * 并获取前面和后面的标签页，如果后面有标签页，
     * 就跳到后一个标签页并删除当前标签页，如果前面有
     * 就跳到前一个标签页并删除当前标签页。
     */

    const closeTabIndex = tabs.value.findIndex((item) => item.id === tab.id);

    const before = tabs.value[closeTabIndex - 1];
    const after = tabs.value[closeTabIndex + 1];

    if (after) {
      _close(tab);
      to(after);
    } else if (before) {
      _close(tab);
      to(before);
    } else {
      _close(tab)
    }

    if (tabs.value.length === 0) {
      current.value = defaultTab.id;
      to(defaultTab);
    }
  };

  const init = () => {
    push(defaultTab);
    to(defaultTab);
  };

  return { tabs, current, push, to, close, init };
});
