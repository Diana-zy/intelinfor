export default {
  methods: {
    handleCreateTableParentDom() {
      const tables = document.querySelectorAll(".news-detail table");
      tables.forEach((table) => {
        if (
          !table.closest(".table-container-parent") &&
          !table.closest(".table-scroll-wrapper")
        ) {
          const wrapper = document.createElement("div");
          wrapper.className = "table-scroll-wrapper";
          table.parentNode.insertBefore(wrapper, table);
          wrapper.appendChild(table);
        }
      });
    }
  }
};
