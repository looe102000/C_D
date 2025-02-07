const { ref, reactive, computed, onMounted } = Vue;

const chessArray = [
	{ name: "帥", color: "red", energy: "金", score: 30, isClicked: false },
	{ name: "仕", color: "red", energy: "金", score: 24, isClicked: false },
	{ name: "仕", color: "red", energy: "金", score: 24, isClicked: false },
	{ name: "相", color: "red", energy: "火", score: 16, isClicked: false },
	{ name: "相", color: "red", energy: "火", score: 16, isClicked: false },
	{ name: "俥", color: "red", energy: "木", score: 12, isClicked: false },
	{ name: "俥", color: "red", energy: "木", score: 12, isClicked: false },
	{ name: "傌", color: "red", energy: "木", score: 8, isClicked: false },
	{ name: "傌", color: "red", energy: "木", score: 8, isClicked: false },
	{ name: "炮", color: "red", energy: "水", score: 4, isClicked: false },
	{ name: "炮", color: "red", energy: "水", score: 4, isClicked: false },
	{ name: "兵", color: "red", energy: "土", score: 2, isClicked: false },
	{ name: "兵", color: "red", energy: "土", score: 2, isClicked: false },
	{ name: "兵", color: "red", energy: "土", score: 2, isClicked: false },
	{ name: "兵", color: "red", energy: "土", score: 2, isClicked: false },
	{ name: "兵", color: "red", energy: "土", score: 2, isClicked: false },
	{ name: "將", color: "black", energy: "金", score: 30, isClicked: false },
	{ name: "士", color: "black", energy: "金", score: 24, isClicked: false },
	{ name: "士", color: "black", energy: "金", score: 24, isClicked: false },
	{ name: "象", color: "black", energy: "火", score: 16, isClicked: false },
	{ name: "象", color: "black", energy: "火", score: 16, isClicked: false },
	{ name: "車", color: "black", energy: "木", score: 12, isClicked: false },
	{ name: "車", color: "black", energy: "木", score: 12, isClicked: false },
	{ name: "馬", color: "black", energy: "木", score: 8, isClicked: false },
	{ name: "馬", color: "black", energy: "木", score: 8, isClicked: false },
	{ name: "包", color: "black", energy: "水", score: 4, isClicked: false },
	{ name: "包", color: "black", energy: "水", score: 4, isClicked: false },
	{ name: "卒", color: "black", energy: "土", score: 2, isClicked: false },
	{ name: "卒", color: "black", energy: "土", score: 2, isClicked: false },
	{ name: "卒", color: "black", energy: "土", score: 2, isClicked: false },
	{ name: "卒", color: "black", energy: "土", score: 2, isClicked: false },
	{ name: "卒", color: "black", energy: "土", score: 2, isClicked: false }
];

const vm = Vue.createApp({
	setup() {
		// 定義響應式狀態
		const chessArrayState = reactive(chessArray);
		const isMenuOpen = ref(false);
		const topic = ref("");
		const chessToBoard = ref([]);
		const clickCounter = ref(0);
		const date = ref(null);
		const capturedImage = ref("");
		const selectedOption = ref(null);
		const gender = ref("");
		const heavenlyStemEarthlyBranchDate = ref("");
		const isShowAll = ref(false);
		const captureDiv = ref(null); // 新增

		// 計算屬性
		const freshChessArray = computed(() => shuffle(chessArrayState));
		const freshChessToBoard = computed(() => chessToBoard.value);
		const isSelectionComplete = computed(() => {
			const requiredCount = getRequiredChessCount();
			return chessToBoard.value.length === requiredCount;
		});

		const getRequiredChessCount = () => {
			switch (selectedOption.value) {
				case 1:
					return 1;
				case 2:
					return 3;
				case 3:
					return 5;
				case 4:
					return 32; // 假設流年需要32顆棋
				default:
					return -1;
			}
		};

		// 組件掛載後執行
		onMounted(() => {
			getDate();
			convertToHeavenlyStemEarthlyBranch();
		});

		// 切換選單
		const toggleMenu = () => {
			isMenuOpen.value = !isMenuOpen.value;
		};

		// 選擇選項
		const selectOption = (option, anchor) => {
			clearData();
			selectedOption.value = option;
			window.location.href = anchor;
		};

		// 全翻
		const showChess = () => {
			isShowAll.value = true;
			chessArrayState.sort((a, b) => chessArrayState.indexOf(a) - chessArrayState.indexOf(b));
			chessArrayState.forEach(chess => {
				if (chess.isClicked) {
					chess.isHighlighted = true;
				}
			});
		};

		// 洗牌
		const shuffle = (array) => {
			isShowAll.value = false;
			const shuffled = array.slice();
			for (let i = shuffled.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
			}
			return shuffled;
		};

		// 清除數據
		const clearData = () => {
			capturedImage.value = "";
			chessToBoard.value = [];
			clickCounter.value = 0;
			chessArrayState.forEach(chess => chess.isClicked = false);
		};

		// 加載後的陣列
		const shuffleArray = () => {
			clearData();
			chessArrayState = shuffle(chessArrayState);
		};

		// 點擊後棋子依序移動到牌陣內
		const moveToChessBoard = (chess, index) => {
			if (!chess.isClicked && selectedOption.value > 0) {
				const maxClicks = [1, 3, 5, 32][selectedOption.value - 1];
				if (clickCounter.value < maxClicks) {
					chess.isClicked = true;
					chessToBoard.value.push(freshChessArray.value.find(c => c.name === chess.name));
					clickCounter.value++;
				} else {
					alert("選定離手，或是重新洗牌");
					chess.isClicked = false;
				}
			} else {
				alert("請先選擇一個牌陣");
			}
		};

		// 抓系統當前日期
		const getDate = () => {
			const currentDate = new Date();
			const year = currentDate.getFullYear();
			const month = currentDate.getMonth() + 1; // 月份從0開始，需要加1
			const day = currentDate.getDate();
			date.value = `${year}-${month}-${day}`;
			console.log(date.value);
		};

		// 轉換為天干地支日期
		const convertToHeavenlyStemEarthlyBranch = () => {
			const HeavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
			const EarthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
			const baseYear = 1984; // 起始年份
			const yearDiff = new Date().getFullYear() - baseYear;
			const heavenlyStemIndex = yearDiff % 10;
			const earthlyBranchIndex = yearDiff % 12;
			heavenlyStemEarthlyBranchDate.value = `${HeavenlyStems[heavenlyStemIndex]}${EarthlyBranches[earthlyBranchIndex]}`;
		};

		// 返回頂部
		const goTop = () => {
			gender.value = "";
			topic.value = "";
			window.scrollTo({ top: 0, behavior: "smooth" });
		};

		// 擷取畫面並下載
		const captureScreen = () => {
			capturedImage.value = "";
			const element = captureDiv.value;
			const originalStyle = element.style.cssText;
			setTimeout(() => {
				html2canvas(element)
					.then(canvas => {
						capturedImage.value = canvas.toDataURL();
						const link = document.createElement('a');
						link.href = capturedImage.value;
						link.download = 'capture.png';
						link.click();
						element.style.cssText = originalStyle; // 恢復原始樣式
					})
					.catch(error => {
						console.error("擷取畫面失敗:", error);
						element.style.cssText = originalStyle; // 恢復原始樣式
					});
			}, 500); // 延迟时间为 500 毫秒，可根据实际情况调整
		};

		return {
			chessArrayState,
			isMenuOpen,
			topic,
			chessToBoard,
			clickCounter,
			date,
			capturedImage,
			selectedOption,
			gender,
			heavenlyStemEarthlyBranchDate,
			isShowAll,
			freshChessArray,
			freshChessToBoard,
			toggleMenu,
			selectOption,
			showChess,
			shuffle,
			clearData,
			shuffleArray,
			moveToChessBoard,
			getDate,
			convertToHeavenlyStemEarthlyBranch,
			goTop,
			captureScreen,
			captureDiv, // 新增
			isSelectionComplete,
			getRequiredChessCount
		};
	}
}).mount("#app");
