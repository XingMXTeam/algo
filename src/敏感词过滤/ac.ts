
function createAcNode(data) {
    return {
        data,
        children: new Array(26).fill(null),
        isEndingChar: false,
        length: -1,
        fail: null,
    };
}

const createTrie = () => {
    const root = createAcNode("/");
    const insert = (words: string) => {
        let p = root;
        Array.from(words).forEach((c: string) => {
            let index: number = c.charCodeAt(0) - "a".charCodeAt(0);
            // 创建新节点
            if (p.children[index] === null) {
                p.children[index] = createAcNode(c);
            }
            // 指向新节点
            p = p.children[index];
        });
        // 标记为单词结束节点
        p.isEndingChar = true;
        p.length = words.length;
    };

    return {
        insert,
        root
    };
};


//-----------------------

function buildFailurePointer(root) {
  const queue = [];
  root.fail = null; // 根节点标记
  queue.push(root);
  while (queue.length > 0) {
    const p = queue.shift();
    for (let i = 0; i < 26; i++) {
      const pc = p.children[i];
      if (pc === null) {// 跳过空的子节点
        continue;
      }
      if (p === root) { // 根节点的所有子节点的fail指针都指向根节点
        pc.fail = root;
      } else {
        let q = p.fail;
        while (q !== null) {  // 到根节点
          const qc = q.children[pc.data.charCodeAt(0) - "a".charCodeAt(0)]; // 直接定位和pc相等的qc
          if (qc !== null) { // qc存在，则把pc的失败指针指向qc，并且结束寻找
            pc.fail = qc;
            break;
          }
          // 如果这样的qc不能存在，继续往上找
          q = q.fail;
        }
        // 到达根节点了，将pc的失败指针指向root
        if (q === null) {
          pc.fail = root;
        }
      }
      queue.push(pc);
    }
  }
}

function match(root, text) {
  const n = text.length;
  let p = root;
  for (let i = 0; i < n; i++) {
    const idx = text[i].charCodeAt(0) - "a".charCodeAt(0);
    while (p.children[idx] === null && p !== root) {
      p = p.fail;
    }
    p = p.children[idx];
    if (p === null) {
      p = root;
    }
    let tmp = p;
    while (tmp !== root) {
      if (tmp.isEndingChar) {
        const pos = i - tmp.length + 1;
        console.log("起始下标，",pos, "长度", tmp.length);
      }
      tmp = tmp.fail;
    }
  }
}


export function ac_TestFunction() {
    const trie = createTrie();
    const { insert, root } = trie;
    insert("c");
    insert("bc");
    insert("bcd");
    insert("abcd");

    buildFailurePointer(root)
    match(root, "abcd")

    return null
}
